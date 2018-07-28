import { css } from "emotion";

export default {
  root: css`
    position: relative;
  `,
  lastUpdatedBox: css`
    font-size: 12px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 25px;
    padding: 5px 15px;
    border: 1px solid #25244b;
    border-radius: 100px;

    label {
      color: #6f6e98;
    }
    span {
      color: #fff;
    }
  `
};
