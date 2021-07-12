import { Logo } from '@src/components/Logo'
import { css } from 'solid-styled-components'

const containerStyle = css`
  width: 60px;
  height: 60px;
  transform: rotate(-45deg);

  svg {
    width: 100%;
    animation: orbit 2s linear infinite;
  }

  @keyframes orbit {
    from {
      transform: rotateX(0deg) rotate(45deg);
    }

    to {
      transform: rotateX(360deg) rotate(45deg);
    }
  }
`

interface LoadingProps {}

const Loading = (props: LoadingProps) => {
  return (
    <div class={containerStyle}>
      <Logo />
    </div>
  )
}

export default Loading
