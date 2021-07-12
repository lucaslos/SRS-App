import { Link, NavLink, useRoute, useRouter } from '@rturnq/solid-router'
import Icon from '@src/components/Icon'
import { centerContent } from '@src/style/helpers/centerContent'
import { inline } from '@src/style/helpers/inline'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { getQueryLink } from '@src/utils/navigate'
import { match } from '@utils/patternMatching'
import { spring, animate } from 'popmotion'
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${inline()};
  position: absolute;
  height: 72px;
  bottom: 0;
  width: 100%;

  > a {
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

  const [xPercent, setXPercent] = createSignal(
    untrack(() => activePageIndex() * 100),
  )

  createEffect(() => {
    const from = untrack(xPercent)

    const to = activePageIndex() * 100

    if (from === to) {
      return
    }

    const animation = animate({
      from,
      to,
      stiffness: 300,
      mass: 1,
      damping: 26,
      type: 'spring',
      onUpdate: (latest) => {
        setXPercent(latest)
      },
    })

    onCleanup(() => animation.stop())
  })

  function getActiveClass(index: number) {
    return activePageIndex() === index ? 'navActive' : ''
  }

  return (
    <nav class={containerStyle}>
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
    </nav>
  )
}

export default NavBar
