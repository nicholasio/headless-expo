import headlessConfig from "./headless.config";

globalThis.__10up__HEADLESS_CONFIG = { ...headlessConfig };

import { StatusBar } from "expo-status-bar";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
// metro doesn't support package.json exports field @10up/headless-core/react works with web bundlers.
import { BlocksRenderer } from "@10up/headless-core/dist/cjs/react/components/BlocksRenderer";
import {
  HeadingBlock,
  ImageBlock,
  ParagraphBlock,
  SettingsProvider,
  useFetchPost,
} from "@10up/headless-core/dist/cjs/react";
import { isBlockByName } from "@10up/headless-core";

/**
 * Trims raw text nodes
 *
 * @param {*} param0
 * @returns
 */
const RawText = ({ domNode }) => {
  return domNode.data.trim();
};

RawText.defaultProps = {
  /**
   * Catches any non-orphans and non-empty text fields
   *
   * @param {*} node
   * @returns
   */
  test: (node) =>
    node.type === "text" &&
    node.parent !== null &&
    node.data?.trim().length >= 0,
};

/**
 * A noop block
 *
 * You can also use this to create a "allowList" of blocks and ignore blocks you don't want to render
 *
 * @returns
 */
const EmptyBlock = () => <></>;

EmptyBlock.defaultProps = {
  /**
   * Essentially catches any empty text nodes to make sure they don't get rendered under a <View> component
   *
   * @param {*} node
   * @returns
   */
  test: (node) => {
    const allowedBlocks = ["core/paragraph", "core/heading", "core/image"];

    // if this isn't an allowed block catch it
    // if this is an allowed block it should have been handled at this ppint
    if (
      node.type !== "text" &&
      !allowedBlocks.some((blockName) => isBlockByName(node, blockName))
    ) {
      return true;
    }

    return (
      node.type === "text" &&
      (node.parent === null || node.data?.trim().length === 0)
    );
  },
};

const RNParagraphBlock = ({ children }) => {
  return <Text>{children}</Text>;
};

const RNHeadingBlock = ({ children, level }) => {
  return <Text style={styles[`headingLevel${level}`]}>{children}</Text>;
};

const RNImageBlock = ({ children, domNode, height, width, src }) => {
  const caption =
    domNode.children.find((el) => el.name === "figcaption")?.firstChild?.data ??
    "";
  return (
    <>
      <Image
        style={[{ width: width, height: height }]}
        source={{
          uri: src,
        }}
      />
      <Text>{caption}</Text>
    </>
  );
};

function SinglePostComponent() {
  const { loading, data } = useFetchPost({
    postType: "page",
    slug: "react-native-test",
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <BlocksRenderer html={data.post.content.rendered}>
      <ParagraphBlock component={RNParagraphBlock} />
      <HeadingBlock component={RNHeadingBlock} />
      <ImageBlock component={RNImageBlock} />
      <RawText />
      <EmptyBlock />
    </BlocksRenderer>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SinglePostComponent />
      </View>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headingLevel1: {
    fontWeight: "bold",
    fontSize: "26px",
  },
  headingLevel2: {
    fontWeight: "bold",
    fontSize: "20px",
  },
});
