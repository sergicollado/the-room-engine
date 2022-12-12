import { ActionType } from "./actions";
import { ResponseDefinition } from "./responseDefinition";
import {Place, PlaceId} from "./place";

import {Response} from "./responseController";
import { logger } from "../shared/logger";

interface PlotAction {type: ActionType, target:string}
interface Trigger {type: ActionType, target:string|ActionType}
interface ResponseOutput {text:string,image:string,responseDefinition?:ResponseDefinition};

interface Plot{
 action:PlotAction,
 trigger?:Trigger,
 response:ResponseOutput
}
export class StoryPlots{
  plotsConfig: Plot[];
  constructor(plotsConfig: Plot[]) {
    this.plotsConfig = plotsConfig;
  }

  getInitialPlot ():Plot | void {
    return this.plotsConfig.find(({action}) => action.type === ActionType.START) || 
    logger.warning("Start Plot not found");
  };

  getPlots (plotAction:ActionType, targetId:string):Plot[] {
    const plot = this.plotsConfig.filter(({action}) => {
      return action.type === plotAction && action.target === targetId
    })
    return plot;
  }
  removeUsedPlots (plotAction:ActionType, targetId:string) {
    this.plotsConfig = this.plotsConfig.filter(({action}) => {
      return action.type !== plotAction || action.target !== targetId
    });
  }

  runTrigger (trigger:PlotAction , place: Place, targetId: string) {
    if (trigger.type === ActionType.UNHIDE) {
      const targetTrigger = place.getHiddenObject(trigger.target);
      targetTrigger.unhide();
      return ResponseDefinition.PLOT_SUCCESS;
    }

    if (trigger.type === ActionType.THE_END) {
      return ResponseDefinition.THE_END;
    }
    if(trigger.type === ActionType.REMOVE_SIMILAR) {
      this.removeUsedPlots(trigger.target as ActionType, targetId);
      return ResponseDefinition.PLOT_SUCCESS;
    }
  }

  runPlot ({action, targetId, place}:{action:ActionType,targetId:string | PlaceId, place?: Place}) {
    const plots = this.getPlots(action, targetId);
    if(plots.length === 0) {
      return;
    }

    let finalResponse;
    plots.forEach(({ response, trigger}) => {
      finalResponse = response || {};
      finalResponse.responseDefinition = ResponseDefinition.PLOT_SUCCESS;
      if(trigger) {
        finalResponse.responseDefinition = this.runTrigger(trigger,place,targetId)
      }
    });
    this.removeUsedPlots(action, targetId);
    if(!finalResponse) {
      logger.warning("🚀 ~ file: storyPlots.ts:71 ~ StoryPlots ~ runPlot ~ finalResponse EMPTY");
      return;
    }
    return Response(finalResponse);
  }

  getPrimitives () { return this.plotsConfig;}
}
