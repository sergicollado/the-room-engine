const { InteractiveObject } = require("../domain/interactiveObjects")
import {InteractiveObjectConfig} from "../inputConfig/interactiveObjectType";

export const interactiveObjectMapper = (config: InteractiveObjectConfig) => {

  return new InteractiveObject(config);
}

