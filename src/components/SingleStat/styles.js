import { css } from "emotion";
import { textColors } from "styling/variables";

export default {
  box: css`
    border: 1px solid #25244b;
    border-radius: 4px;
    min-height: 340px;
    padding: 2em;
    display: flex;
    flex-direction: column;
    transition: all 200ms ease;

    &:hover {
      background-color: #11112f;
      transform: scale(1.07);
    }
  `,

  statTop: isGreen => css`
    flex-grow: 1;

    h2 {
      font-size: 40px;
      color: ${isGreen ? textColors.green : textColors.red};
      padding-bottom: 0.3em;
    }

    div {
      background: ${isGreen ? textColors.green : textColors.red};
      border-radius: 4px;
      display: inline-block;
      padding: 0.3em 0.5em;
      color: #fff;
    }
  `,

  statBottom: css`
    h3 {
      font-size: 14px;
      color: #ffffff;
      padding-bottom: 0.5em;
    }

    p {
      font-family: Helvetica;
      font-size: 14px;
      color: #6f6e98;
      line-height: 20px;
    }
  `
};
