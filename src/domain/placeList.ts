import { Place, PlaceId, PlaceParams } from "./place";

export interface ConfigPlaces{
  placeList: PlaceParams[],
  currentPlace?: PlaceId
}

export class PlaceList{
  places: Place[] = [];
  currentPlace: PlaceId | undefined;

  constructor(configPlaces: ConfigPlaces) {
    this.currentPlace = configPlaces.currentPlace;
    this.places = configPlaces.placeList.map((config:PlaceParams) => new Place(config));
  }

  getInitialPlayerPosition():Place {
    if(!this.currentPlace) {
      return this.places[0];
    }
    return this.places.find(({id}) => this.currentPlace === id) || this.places[0];
  }

  find(placeId: PlaceId) {
    return this.places.find(({id}) => { return id===placeId});
  }

  getPrimitives(): PlaceParams[] {
    return this.places.map((place:Place) => place.getPrimitives())
  }

  getWhereIsAbleToGoDescriptions(conjunction:string) {
    return this.places.map(({smallDescription}) => smallDescription.text).join(` ${conjunction} `);
  }
}
