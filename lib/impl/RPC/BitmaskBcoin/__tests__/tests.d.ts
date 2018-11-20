/**!
 *
 * Copyright 2016-2018 Uniquid Inc. or its affiliates. All Rights Reserved.
 *
 * License is in the "LICENSE" file accompanying this file.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
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
