## Installation

If you get peerDeps errors when installing, install with `npm install --force` as peer deps still needs to be updated in `@10up/headless-core`.

There might be a couple of warnings which will be fixed in `@10up/headless-core` for improve react-native compatibility but that should not prevent from testing out the `BlocksRenderer` component.

This app should render the following
![result](https://cldup.com/6WHqS8DGTg.png)

`react-dom` is only installed in order to be able to run this through `react-native-web` however only react-native compoments are used in the PoC.