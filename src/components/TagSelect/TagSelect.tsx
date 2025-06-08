"use client";
import React from "react";
import CreatableSelect from "react-select/creatable";
import { LegendLabel } from "../form/common";
import { components, OptionProps } from "react-select";

type TagWithCount = {
  tag: string;
  count: number;
};

type TagWithCountOption = {
  value: string;
  label: string;
};

type TagSelectProps = {
  tagCounts: TagWithCount[];
  selectedTags: string[];
  maxResults: number;
  onChange: (selectedTags: string[]) => void;
};

const Option = (props: OptionProps<TagWithCountOption>) => {
  const [tag, count] = props.data.label.split(" ");
  return (
    <components.Option {...props}>
      <div className="flex justify-between">
        <span>{tag}</span>
        <span>{count}</span>
      </div>
    </components.Option>
  );
};

const clearStyleProxy = new Proxy({}, { get: () => () => {} });

export default function TagSelect(props: TagSelectProps) {
  const instanceId = React.useId();
  return (
    <fieldset className="fieldset" suppressHydrationWarning>
      <LegendLabel>Select tags</LegendLabel>
      <CreatableSelect
        className="tag-select__container"
        classNamePrefix="tag-select"
        instanceId={instanceId}
        styles={clearStyleProxy}
        // menuIsOpen
        isClearable
        closeMenuOnSelect={false}
        isMulti
        components={{ Option }}
        value={props.selectedTags.map((tag) => ({
          value: tag,
          label: tag,
        }))}
        options={props.tagCounts.map((tc) => ({
          value: tc.tag,
          label: `${tc.tag} ${tc.count}`,
        }))}
        onChange={(tags) => props.onChange(tags.map((tag) => tag.value))}
      />
    </fieldset>
  );
}
