import ButtonElement from '@src/components/ButtonElement'
import Loading from '@src/components/Loading'
import CardTile from '@src/pages/list/CardTile'
import { cardsStore } from '@src/stores/cardsStore'
import { centerContent } from '@src/style/helpers/centerContent'
import { inline } from '@src/style/helpers/inline'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors } from '@src/style/theme'
import { searchItems } from '@utils/searchItems'
import { sortByPriority } from '@utils/simpleSort'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { css, styled } from 'solid-styled-components'

const containerStyle = css`
  flex: 1 1;
  align-self: center;
  width: 100%;
  ${stack()};

  header {
    ${responsiveWidth(600, 16)};
    ${stack()};
  }

  .search {
    height: 36px;
    border-radius: 36px;
    border: 0;
    width: 100%;
    color: #fff;
    padding: 0 16px;
    letter-spacing: 0.04em;

    &::placeholder {
      color: ${colors.primary.alpha(0.5)};
    }

    background: ${colors.bgSecondary.var};

    &:focus {
      outline: 0;
    }
  }

  .items-scroll {
    padding-bottom: 72px;
    margin-top: 18px;
    width: 100%;
    overflow-y: scroll;
    flex: 1 1;
    ${stack()};
  }

  .items {
    ${responsiveWidth(600, 16)};
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;

    .empty-msg {
      color: ${colors.primary.alpha(0.5)};
      letter-spacing: 0.08em;
      margin-top: 50px;
      grid-column: 1 / span 2;
      text-align: center;
      ${centerContent};
    }
  }
`

const filtersStyle = css`
  margin-top: 16px;
  width: 100%;
  overflow-x: auto;
  ${inline({ gap: 12 })}

  > button {
    background: ${colors.secondary.alpha(0.2)};
    padding: 4px 16px;
    letter-spacing: 0.08em;
    border-radius: 40px;
    color: ${colors.secondary.var};
    font-weight: 500;
    ${transition()};

    &.active {
      background: ${colors.secondary.var};
      color: ${colors.bgPrimary.var};
    }
  }
`

const [listProps, setListProps] = createStore<ListProps>({
  showAnswer: false,
  filter: 'all',
})

type ListProps = {
  showAnswer: boolean
  filter: 'all' | 'to-review'
}

const List = () => {
  const [searchQuery, setSearchQuery] = createSignal('')

  const filteredCards = createMemo(() => {
    let filteredItems = cardsStore.cards.allIds.map(
      (id) => cardsStore.cards.byId[id]!,
    )

    if (searchQuery()) {
      return searchItems({
        searchQuery: searchQuery(),
        items: filteredItems,
        getStringToMatch: (card) => {
          return `${card.front}${listProps.showAnswer ? ` ${card.answer}` : ''}`
        },
      })
    }

    if (listProps.filter !== 'all') {
      filteredItems = filteredItems.filter((card) => !card.draft)
    }

    const sortedItems = sortByPriority(filteredItems, (card) =>
      card.draft ? 2 * card.createdAt : 1 * card.createdAt,
    )

    return sortedItems
  })

  return (
    <div class={containerStyle}>
      <header>
        <input
          class="search"
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            setSearchQuery(e.currentTarget.value)
          }}
        />

        <div className={filtersStyle}>
          <ButtonElement
            classList={{ active: listProps.filter === 'all' }}
            onClick={() => setListProps('filter', 'all')}
          >
            All
          </ButtonElement>
          <ButtonElement
            classList={{ active: listProps.filter === 'to-review' }}
            onClick={() => setListProps('filter', 'to-review')}
          >
            To review
          </ButtonElement>
          <ButtonElement
            classList={{ active: listProps.showAnswer }}
            onClick={() => setListProps('showAnswer', !listProps.showAnswer)}
          >
            Show Back
          </ButtonElement>
          {/* TODO: review tomorrow */}
          {/* TODO: sort by */}
        </div>
      </header>

      <div className="items-scroll">
        <div className="items">
          <Switch>
            <Match when={cardsStore.status === 'loading'}>
              <div className="empty-msg">
                <Loading />
              </div>
            </Match>

            <Match when={cardsStore.status === 'success'}>
              <For
                each={filteredCards()}
                fallback={<div class="empty-msg">No cards</div>}
              >
                {(card) => (
                  <CardTile card={card} showAnswer={listProps.showAnswer} />
                )}
              </For>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default List
