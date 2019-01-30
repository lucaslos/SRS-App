import * as React from 'react';
import styled from '@emotion/styled';
import { colorPrimary, colorSecondaryDarker } from 'style/theme';
import { centerContent } from 'style/modifiers';

type Tags = {
  tags?: string[];
};

const colors: { [k: string]: { bg: string; color?: string } } = {
  verb: {
    bg: '#E91E63',
    color: '#fff',
  },
  adjective: {
    bg: '#00BCD4',
  },
  noun: {
    bg: '#cddc39',
  },
  adverb: {
    bg: '#ff9800',
  },
};

const Container = styled.div`
  ${centerContent};
  flex-wrap: wrap;
  width: 100%;
  /* position: relative; */
  /* height: 32px; */
  /* width: 100%; */
  padding: 12px 12px 8px;
  padding-right: 0;
`;

const Tag = styled.div<{ color: string }>`
  float: left;
  height: 32px;
  line-height: 30px;
  padding: 0 16px;
  font-size: 18px;
  font-family: 'Source Sans Pro';
  font-weight: 400;
  letter-spacing: 1px;
  vertical-align: middle;
  margin-right: 12px;
  margin-bottom: 8px;

  background-color: ${props =>
    (colors[props.color] && colors[props.color].bg) || colorPrimary};
  color: ${props =>
    (colors[props.color] && colors[props.color].color) || colorSecondaryDarker};

  border-radius: 32px;
`;

const Tags = ({ tags = [] }: Tags) => (
  <Container>
    {tags.map(tag => (
      <Tag key={tag} color={tag as string}>
        {tag}
      </Tag>
    ))}
  </Container>
);

export default Tags;