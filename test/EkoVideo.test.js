import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import {EkoVideo} from "../src";

const mockLoad = jest.fn();

jest.mock('eko-js-sdk', () => {
    const PlayerMock = jest.fn().mockImplementation(() => {
        // a poor man's event handler
        let eventHandlers = {};

        return {
            load: mockLoad,
            on: jest.fn((eventName, handler) => {
                eventHandlers[eventName] = eventHandlers[eventName] || [];
                eventHandlers[eventName].push(handler);
            }),
            off: jest.fn((eventName, handler) => {
                let events = eventHandlers[eventName];
                const index = events.indexOf(handler);
                if (index > -1) {
                    events.splice(index, 1);
                }
            }),
            triggerEvent: (eventName, ...args) => eventHandlers[eventName].forEach(handler => handler.apply(null,args))
        };
    });

    PlayerMock.isSupported = jest.fn(()=>true);

    return PlayerMock;
});

describe('EkoVideo', () => {
    test('onPlayerInit should be called with the player reference', () => {

        let onPlayerInitPromise = new Promise(resolve => {
            mount(<EkoVideo id="123" onPlayerInit={playerInstance => resolve(playerInstance)}/>);
        })

        return onPlayerInitPromise.then(playerInstance => expect(playerInstance).not.toBeNull())
    });

    test('events param should register handlers in the eko-js-sdk player (object input)', () => {
        let eventHandlers = {
            nodestart: ()=>{}
        }

        mount(<EkoVideo id="123" events={eventHandlers} />);

        expect(mockLoad).toHaveBeenCalledWith("123",
            expect.objectContaining({
                events: ["nodestart"]
            })
        );

    });

    test('events param should register handlers in the eko-js-sdk player (array input)', () => {
        let events = ["nodestart"];
        mount(<EkoVideo id="123" events={events} />);

        expect(mockLoad).toHaveBeenCalledWith("123",
            expect.objectContaining({
                events: ["nodestart"]
            })
        );

    });


    test('Registered event handlers in eko-js-sdk should be called with the right params', () => {
        let thisChecker = jest.fn();
        let nodestartEventHandler = jest.fn(function(){
            thisChecker(this);
        });

        let eventHandlers = {
            nodestart: nodestartEventHandler
        }

        let onPlayerInitPromise = new Promise(resolve => {
            mount(
                <EkoVideo id="123"
                          events={eventHandlers}
                          onPlayerInit={playerInstance => resolve(playerInstance)}
                />
            );
        })

        return onPlayerInitPromise.then( playerInstance => {
            playerInstance.triggerEvent("nodestart", "node123", 0);
            expect(nodestartEventHandler).toHaveBeenCalledWith("node123", 0);
            expect(thisChecker).toHaveBeenCalledWith(playerInstance);
        })
    });

    test('Registered event handlers in eko-js-sdk should be removed when component is unmounted', () => {
        let nodestartEventHandler = jest.fn();

        let eventHandlers = {
            nodestart: nodestartEventHandler
        }

        let component;

        let onPlayerInitPromise = new Promise(resolve => {
            component = mount(
                <EkoVideo id="123"
                          events={eventHandlers}
                          onPlayerInit={playerInstance => resolve(playerInstance)}
                />
            );
        })

        return onPlayerInitPromise.then( playerInstance => {
            component.unmount();
            expect(playerInstance.off).toHaveBeenCalledWith("nodestart", expect.any(Function));
        })
    });

    test('expandToFillContainer: false should output the right class name', () => {
        let component = mount(<EkoVideo id="123"/>);
        expect(component.find('.eko_component_container').hasClass('intrinsicSize')).toEqual(true);
        expect(component.find('.eko_component_container').hasClass('expand')).toEqual(false);

    });

    test('expandToFillContainer: true should output the right class name', () => {
        let component = mount(<EkoVideo id="123" expandToFillContainer={true}/>);
        expect(component.find('.eko_component_container').hasClass('intrinsicSize')).toEqual(false);
        expect(component.find('.eko_component_container').hasClass('expand')).toEqual(true);

    });
});
