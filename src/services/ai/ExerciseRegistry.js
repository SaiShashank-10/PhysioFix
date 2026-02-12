import { Squat } from "./exercises/Squat";
import { OverheadPress } from "./exercises/OverheadPress";
import { BicepCurl } from "./exercises/BicepCurl";
import { Lunge } from "./exercises/Lunge";

export const EXERCISES = {
    SQUAT: Squat,
    OVERHEAD_PRESS: OverheadPress,
    BICEP_CURL: BicepCurl,
    LUNGE: Lunge
};

export const getExercise = (id) => {
    return Object.values(EXERCISES).find(ex => ex.id === id) || Squat;
};
