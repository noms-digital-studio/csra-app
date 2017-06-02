import { cellAssignment } from '../../../../client/javascript/services';

describe('#Full assessment Decision engine', () => {
  context('when the outcomes of both assessments are the same', () => {
    it('returns the outcome of a single cell', () => {
      expect(
        cellAssignment({
          healthcareSharedCell: false,
          riskAssessmentSharedCell: false,
        }),
      ).to.equal('single cell');
    });

    it('returns the outcome of a shared cell', () => {
      expect(
        cellAssignment({
          healthcareSharedCell: true,
          riskAssessmentSharedCell: true,
        }),
      ).to.equal('shared cell');
    });
  });

  context('when the healthcare outcome is single cell', () => {
    context('and the risk assessment outcome is shared cell', () => {
      it('returns single cell ', () => {
        expect(
          cellAssignment({
            healthcareSharedCell: false,
            riskAssessmentSharedCell: true,
          }),
        ).to.equal('single cell');
      });
    });
  });

  context('when the risk outcome is single cell', () => {
    context('and the healthcare assessment outcome is shared cell', () => {
      it('returns single cell ', () => {
        expect(
          cellAssignment({
            healthcareSharedCell: true,
            riskAssessmentSharedCell: false,
          }),
        ).to.equal('single cell');
      });
    });
  });
});
