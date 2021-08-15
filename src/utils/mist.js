export const generateSmokeParticles = () => Array.from({length: 30})
  .reduce((acc, _, index) => {
    const smoke1 = {
      positionX: Math.random() * 0.3 - 0.4,
      positionY: Math.random() * 0.09 + 0.015,
      positionZ: -0.13 - index * 0.014,
      key: index + '_1',
      rotationZ: Math.random(),
    };
    const smoke2 = {
      positionX: Math.random() * 0.3,
      positionY: Math.random() * 0.09 + 0.015,
      positionZ: -0.13 - index * 0.014,
      key: index + '_2',
      rotationZ: -1 * Math.random(),
    };
    acc.push(smoke1, smoke2);
    return acc;
  }, []);
