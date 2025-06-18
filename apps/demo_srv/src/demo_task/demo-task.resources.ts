
import { AditService } from '@adit/lib/adit';

// TODO : add check for allow raw query
// TODO : seperate feature for read and write
export const resources = {
  feature: [AditService.FeaturNames.DEMO_SRV_DEMO],
  topics: [AditService.TopicNames.DEMO_SRV__DEMO_TASK_CREATED]
}