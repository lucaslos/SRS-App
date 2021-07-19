import { Link, useRouter } from '@rturnq/solid-router'
import Icon from '@src/components/Icon'
import { centerContent } from '@src/style/helpers/centerContent'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { useSpring } from '@src/utils/hooks/useSpring'
import { getQueryLink } from '@src/utils/navigate'
import { match } from '@utils/patternMatching'
import { animate, velocityPerSecond } from 'popmotion'
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  position: absolute;
  height: 72px;
  bottom: 0;
  width: 100%;
  ${centerContent};
  backdrop-filter: blur(20px);
  background: ${colors.bgPrimary.alpha(0.5)};

  .content {
    position: relative;
    ${inline()};
    ${responsiveWidth(600)};
  }

  a {
    flex: 1;
    ${centerContent};
    color: ${colors.secondary.var};
    ${transition()};

    &.add {
      color: ${colors.primary.var};
    }

    --icon-size: 32px;

    &.navActive {
      color: ${colors.bgPrimary.var};
    }
  }

  .active {
    position: absolute;
    height: 42px;
    width: 33.33%;
    ${centerContent};

    &::before {
      content: '';
      border-radius: 40px;
      width: 80px;
      background: ${gradients.primary};
      height: 100%;
    }
  }
`

const NavBar = () => {
  const router = useRouter()

  const activePageIndex = createMemo(() => {
    return match
      .inferedValue(router.location.path)<number>()
      .with('/', 0)
      .otherwise(2)
  })

  const xPercent = useSpring(() => activePageIndex() * 100)

  function getActiveClass(index: number) {
    return activePageIndex() === index ? 'navActive' : ''
  }

  return (
    <nav class={containerStyle}>
      <div className="content">
        <div
          class="active"
          style={{ transform: `translate3d(${xPercent()}%, 0, 0)` }}
        />

        <Link href="/" class={getActiveClass(0)}>
          <Icon name="check" />
        </Link>

        <Link href={getQueryLink({ add: 'new' })} class={`add`}>
          <Icon name="add" />
        </Link>

        <Link href="list" class={getActiveClass(2)}>
          <Icon name="list" />
        </Link>
      </div>
    </nav>
  )
}

export default NavBar
