import React from 'react'
import parse from 'html-react-parser';
import TAG_COLORS from '../utils/tag_colors';

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  color?: string
  onClick: (any) => any
  mode: string
  anom: string
  anom_style: string
  data_i: number
}


const MarkNoTag: React.SFC<MarkProps> = props => (
  props.mode == "Preview" ?
  <mark>
    {props.anom}
    {" "}
  </mark>
  :
  <mark
    style={{backgroundColor: TAG_COLORS[props.tag] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
    data-start={props.start}
    data-end={props.end}
    id = {props.data_i}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    {parse(props.content)}
  </mark>
)

export default MarkNoTag