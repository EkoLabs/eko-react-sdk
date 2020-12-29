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
                eventHandlers[eventName] = [...(eventHandlers[eventName] || []), handler]
            }),
            off: jest.fn((eventName, handler) => {
                let events = eventHandlers[eventName];
                const index = events.indexOf(handler);
                if (index > -1) {
                    events.splice(index, 1);
                }
            }),
            triggerEvent: eventName => eventHandlers[eventName].forEach(handler => handler())
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

    test('Should register requested event handlers in the eko-js-sdk player', () => {
        let eventHandlers = {
            nodestart: ()=>{}
        }

        mount(
            <EkoVideo id="123" events={eventHandlers} />
        );

        expect(mockLoad).toHaveBeenCalledWith("123",
            expect.objectContaining({
                events: ["nodestart"]
            })
        );

    });

    test('Registered event handlers in eko-js-sdk should be called', () => {
        let nodestartEventHandler = jest.fn();
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
            playerInstance.triggerEvent("nodestart");
            expect(nodestartEventHandler).toHaveBeenCalled();
        })
    });
});
