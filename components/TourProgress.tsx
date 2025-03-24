import React from 'react';
import {View} from 'react-native';
import {ProgressStep, ProgressSteps} from 'react-native-progress-steps';
import {colors} from "../globalStyles";

const TourProgress = ({ visitedSteps, locations }: { visitedSteps: number; locations: any[] }) => {
    return (
        <View style={{ flex: 1, padding: 0}}>
            <ProgressSteps
                activeStep={visitedSteps - 1}
                activeStepIconBorderColor={colors.accent}
                activeStepIconColor={colors.accent}
                activeLabelColor={colors.accent}
                completedStepIconColor={colors.accent}
                completedProgressBarColor={colors.accent}
                progressBarColor={colors.primary}
                disabledStepIconColor={colors.primary}
                completedCheckColor="transparent"
                activeStepNumColor="transparent"
                completedStepNumColor="transparent"
                disabledStepNumColor="transparent"
                marginBottom={10}
                topOffset={10}
            >
                {Array.from({ length: locations.length }).map((_, index) => (
                    <ProgressStep
                        key={index}
                        label=""
                        removeBtnRow
                    />
                ))}
            </ProgressSteps>
        </View>
    );
};

export default TourProgress;


