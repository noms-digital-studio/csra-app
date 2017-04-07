import express from 'express';

const router = express.Router();

function getBuildInfo() {
  try {
    // eslint-disable-next-line global-require,import/no-unresolved
    return require('../../build-info.json');
  } catch (ex) {
    return {};
  }
}

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    ...getBuildInfo(),
  });
});

export default router;
