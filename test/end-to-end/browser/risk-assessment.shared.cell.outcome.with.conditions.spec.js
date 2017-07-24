import whenTheOfficerAddsThePrisonersDetails from './tasks/theOfficerAddsThePrisonersDetails.task';
import {
  whenALowRiskPrisonerWhoUsesDrugsIsAssessed,
  thenTheAssessmentIsCompleted,
} from './tasks/lowRiskPrisonerAssessed.task';
import { givenThatTheOfficerIsSignedIn } from './tasks/officerSignsIn.task';

describe('Risk assessment (shared cell outcome with conditions)', () => {
  it('Assesses a low risk prisoner who uses drugs', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheOfficerAddsThePrisonersDetails();
    whenALowRiskPrisonerWhoUsesDrugsIsAssessed();
    thenTheAssessmentIsCompleted({
      sharedText: 'shared cell with conditions',
      reasons: [
        { question_id: 'drug-misuse', reason: 'Has indicated drug use' },
      ],
      hasUsedDrugs: true,
    });
  });
});
