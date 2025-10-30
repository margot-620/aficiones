
export interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  transportation: string;
  notes: string;
  photoSuggestion?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  schedule: ScheduleItem[];
}

export interface Itinerary {
  title: string;
  itinerary: DayPlan[];
}

export interface UserInput {
  destination: string;
  flightPlan: string;
  transportation: string;
  accommodation: string;
  savedPlaces: string;
  attractions: string;
}

export interface GroundingChunk {
  maps: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            uri: string;
            title: string;
            text: string;
        }[];
    }[];
  }
}