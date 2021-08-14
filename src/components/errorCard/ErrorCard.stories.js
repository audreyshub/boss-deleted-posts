import React from 'react'
import ErrorCard from './ErrorCard'

// Data
import data from './data/data.js'
import strings from './data/strings.json'

export default {
  title: 'Organisms/ErrorCard',
  component: ErrorCard,
}

const Template = (args) => <ErrorCard {...args} />

export const Primary = Template.bind({})

Primary.storyName = 'Primary'
Primary.args = {
  ...data,
  label: strings.label,
  link: '/',
}
