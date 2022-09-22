import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
// metro doesn't support package.json exports field @10up/headless-core/react works with web bundlers.
import { BlocksRenderer } from '@10up/headless-core/dist/cjs/react/components/BlocksRenderer';
import { isBlockByName } from '@10up/headless-core';

const mockWordPressPostContentResponse = `
<p data-wp-block-name='core/paragraph'>this is a paragraph</p>
<ul data-wp-block-name='core/list'>
<li data-wp-block-name='core/list-item'>
This is a list item 1
</li>
<li data-wp-block-name='core/list-item'>
This is a list item 2
</li>
</ul>`;


/**
 * Trims raw text nodes
 * 
 * @param {*} param0 
 * @returns 
 */
const RawText = ({ domNode }) => {
  return domNode.data.trim();
}

RawText.defaultProps = {
  /**
   * Catches any non-orphans and non-empty text fields
   * 
   * @param {*} node 
   * @returns 
   */
  test: (node) => node.type === 'text' && node.parent !== null && node.data?.trim().length >= 0
}

const ParagraphBlock = ({ children }) => {
  return <Text>[Text Component]{children}[Text Component]</Text>
};

const ListWrapperBlock = ({ children }) => {
  return <View><Text>[React Native List Component]</Text>{children}<Text>[React Native List Component]</Text></View>
}

const ListItemWrapperBlock = ({ children }) => {
  return <Text>[React Native List Item]{children}[React Native List Item]</Text>
}

/**
 * In this example FlatListBlock goes over its children to build an actual list.
 * 
 * This assumes this the list is text only
 * 
 * @param {*} param0 
 * @returns 
 */
const FlatListBlock = ({ children }) => {
  // note: at this point children has already recursively gone through the "dom-to-react" conversion
  const items = children.filter((node) => node.type === 'li').map(child => { return child.props.children; });
  
  const renderItem = ({ item }) => {
    return (
      <Text>{item}</Text>
    );
  }
  return <FlatList data={items} renderItem={renderItem} />
}

/**
 * A noop block
 * 
 * You can also use this to create a "allowList" of blocks and ignore blocks you don't want to render
 * 
 * @returns 
 */
const EmptyBlock = () => <></>

EmptyBlock.defaultProps = {
  /**
   * Essentially catches any empty text nodes to make sure they don't get rendered under a <View> component
   * 
   * @param {*} node 
   * @returns 
   */
  test: (node) => {
    return node.type === 'text' && (node.parent === null || node.data?.trim().length === 0);
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.heading}>Example 1</Text>
      <BlocksRenderer html={mockWordPressPostContentResponse}>
        <RawText />
        <ParagraphBlock test={(node) => isBlockByName(node, 'core/paragraph')} />
        <ListWrapperBlock test={(node) => isBlockByName(node, 'core/list')} />
        <ListItemWrapperBlock test={(node) => isBlockByName(node, 'core/list-item')} />
        <EmptyBlock />
      </BlocksRenderer>

      <Text style={styles.heading}>Example 2</Text>

      <BlocksRenderer html={mockWordPressPostContentResponse}>
        <RawText />
        <ParagraphBlock test={(node) => isBlockByName(node, 'core/paragraph')} />
        {/* A more complex block to render a web list into a flat list component */}
        <FlatListBlock test={(node) => isBlockByName(node, 'core/list')} />
        <EmptyBlock />
      </BlocksRenderer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '20px'
  }
});
