
import { AditService } from '@adit/lib/adit';

export const resources = {
  feature: {
    featureNames: [AditService.FeaturNames.PATIENT_SRV__PATIENT],
    featureActions: [AditService.FeatureActions.CREATE]
  },
  topics: [AditService.TopicNames.PATIENT_SRV__PATIENT_CREATED]
}