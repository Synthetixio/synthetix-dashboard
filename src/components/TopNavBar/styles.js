import { css } from "emotion";

export default {
  navBar: css`
    background-color: transparent !important;
    padding: 0.5rem 1rem 1rem 1rem;
  `,
  navBarMenu: css`
    background-color: transparent !important;
  `,
  mobileNavSections: css`
    padding: 0.3rem 0.75rem 0 0.75rem;
    margin-bottom: 0.3rem !important;

    a {
      padding-bottom: 0.6rem;
      &.is-active {
        color: #fff;

        border-bottom: 2px solid #fff;
      }
    }

    &:after {
      content: " ";
      width: 100%;
      height: 1px;
      display: block;
      background-color: #25244b;
      margin-top: -0.5px;
    }
  `
};
