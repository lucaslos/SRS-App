import React from 'react';
import PropTypes from 'prop-types';
import svgPaths from 'utils/iconsStore';

const Icon = ({ name, color, size }) => {
  const styles = {
    svg: {
      display: 'block',
    },
    path: {
      fill: color,
    },
  };

  return (
    <svg
      className="icon"
      style={styles.svg}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 1024 1024"
    >
      <path
        style={styles.path}
        d={svgPaths[name]}
      />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 24,
  color: '#000',
};

export default Icon;
