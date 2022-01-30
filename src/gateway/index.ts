import { Namespace, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { chatGateway } from "./chat";

const gateways = {
    chat: chatGateway,
};

type GatewayTypes<Type> = {
    // eslint-disable-next-line no-unused-vars
    [_ in keyof Type]: Namespace<
        DefaultEventsMap,
        DefaultEventsMap,
        DefaultEventsMap,
        any
    >;
};

export const registerGateways = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
    const namespaces: GatewayTypes<typeof gateways> = Object.entries(
        gateways,
    ).map((entry) => {
        const [name, nsp] = entry;

        return {
            [name]: nsp(io),
        } as any;
    })[0];

    return namespaces;
};
