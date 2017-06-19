import { cellAssignment } from '../../../../client/javascript/services';

describe('#Full assessment Decision engine', () => {
  context('when the outcomes of both assessments are the same', () => {
    it('returns the outcome of a single cell when both assessments indicate single cell', () => {
      expect(
        cellAssignment({
          healthcare: {
            sharedCell: false,
          },
          riskAssessment: {
            sharedCell: false,
          },
        }),
      ).to.equal('single cell');
    });

    it('returns the outcome of a shared cell when both assessments indicate shared cell', () => {
      expect(
        cellAssignment({
          healthcare: {
            sharedCell: true,
          },
          riskAssessment: {
            sharedCell: true,
          },
        }),
      ).to.equal('shared cell');
    });
  });
  context('when the healthcare outcome is single cell', () => {
    context('and the risk assessment outcome is shared cell', () => {
      it('returns single cell ', () => {
        expect(
          cellAssignment({
            healthcare: {
              sharedCell: false,
            },
            riskAssessment: {
              sharedCell: true,
            },
          }),
        ).to.equal('single cell');
      });
    });
  });

  context('when the risk assessment outcome is shared cell with conditions', () => {
    context('and the outcome of both assessments are a variation of shared cell', () => {
      it('returns the outcome of a both assessments are as shared cell with conditions', () => {
        expect(
          cellAssignment({
            healthcare: {
              sharedCell: true,
            },
            riskAssessment: {
              sharedCell: true,
              conditions: true,
            },
          }),
        ).to.equal('shared cell with conditions');
      });
    });
  });

  context('when the risk assessment outcome is single cell', () => {
    context('and the healthcare assessment outcome is shared cell', () => {
      it('returns single cell ', () => {
        expect(
          cellAssignment({
            healthcare: {
              sharedCell: true,
            },
            riskAssessment: {
              sharedCell: false,
            },
          }),
        ).to.equal('single cell');
      });
    });
  });
});
