import { injectGlobal } from "emotion";

injectGlobal`
html {
  background-color: #0E0B23;
}

a {
  color: #6F6E98;
  &:hover {
    color: #fff;
  }
}

a.navbar-item {
  font-size: 14px;
  color: #6F6E98;
  transition: all 250ms ease;
  
  &.is-active {
    color: #fff;
    background-color: transparent;
  }
  
  &:hover {
    background-color: transparent;
    color: #fff;
  }
}
`;
