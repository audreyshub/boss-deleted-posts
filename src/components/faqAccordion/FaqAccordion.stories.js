import React from 'react'
import FaqAccordion from './FaqAccordion'

// Data
import strings from './data/strings.json'
import items from './data/items.js'

export default {
  title: 'Molecules/FaqAccordion',
  component: FaqAccordion,
}

const Template = (args) => <FaqAccordion {...args} />

export const Primary = Template.bind({})

Primary.storyName = 'Primary'
Primary.args = {
  title: strings.title,
  items: items,
}
