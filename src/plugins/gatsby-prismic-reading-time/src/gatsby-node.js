import readingTime from 'reading-time';

export function onCreateNode({node, actions}) {
  const {createNodeField} = actions;
  if (
    node.internal.type === 'PrismicStructuredTextType' &&
    node.text !== null
  ) {
    createNodeField({
      node,
      name: 'readingTime',
      value: readingTime(node.text),
    });
  }
}
