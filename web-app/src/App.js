import React, { useEffect, useState } from "react"
import useAPI, { APIProvider } from "./hooks/use-api.js"
import useToast from "./hooks/use-toast.js"
import useAccount from "./hooks/use-account.js"
import useNestedTree from "./hooks/use-nested-tree.js"
import useMeters from "./hooks/use-meters.js"
import useTreeState from "./hooks/use-tree-state"
import Page from "./components/Page"
import NoTree from "./components/NoTree"
import NestedWorkTree from "./components/NestedWorkTree"
const emptyObj = {}

function App() {
  const api = useAPI()
  const toast = useToast()
  const [route, changeRouteState] = useState(window.location.pathname)
  const changeRoute = (newRoute, title) => {
    changeRouteState(newRoute)
    window.history.pushState({}, title, newRoute)
  }

  useEffect(() => {
    if (api.accountId) return
    async function createAccount() {
      const response = await api.post(
        "account",
        {},
        { headers: { Prefer: "return=representation" } }
      )
      if (response.data.length !== 1)
        return toast.error("Couldn't create account")
      api.authenticate(response.data[0].account_id)
    }
    createAccount()
    return () => {}
  }, [api.accountId])

  const account = useAccount() || emptyObj
  const treeState = useTreeState(route)
  const {
    dbTree,
    nestedTree,
    changeNestedTree,
    loadingNestedTree,
    treeDoesNotExist
  } = useNestedTree(window.location.pathname, treeState)
  const meters = useMeters()

  return (
    <Page
      visibility="private"
      onChangeTitle={() => null}
      onChangeId={() => null}
      onChangeVisibility={() => null}
      title="Fitness for Beginners"
      id="fitness_for_beginners"
      userName="seveibar"
      onCreateNew={() => null}
      onClickEdit={() => null}
      currentUserAccountName={account.account_name}
    >
      {loadingNestedTree ? (
        "loading"
      ) : treeDoesNotExist ? (
        <NoTree
          onCreateTree={async () => {
            const response = await api.post(
              "tree",
              { owner_id: api.accountId },
              { headers: { Prefer: "return=representation" } }
            )
            changeRoute("/" + response.data[0].tree_path)
          }}
        />
      ) : (
        <div style={{ paddingTop: 20 }}>
          <NestedWorkTree
            inEditMode={false}
            onChangeFlatTree={() => null}
            onChangeMeter={() => null}
            onUnlockTree={() => null}
            onDeleteTree={() => null}
            nestedTree={nestedTree}
            treeOwnerName={dbTree.owner_name}
            meters={meters}
          />
        </div>
      )}
    </Page>
  )
}

export default () => (
  <APIProvider>
    <App />
  </APIProvider>
)
