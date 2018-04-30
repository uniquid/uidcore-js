import { Request, Response } from '../types';
export declare const NO_RESPONSE: null;
export interface Test {
    scenario: string;
    description: string;
    request: Request;
    response: Response | typeof NO_RESPONSE;
}
declare const tests: Test[];
export default tests;
