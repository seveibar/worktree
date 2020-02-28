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
import LoadingScreen from "./components/LoadingScreen"
import { exampleTree } from "./components/NestedWorkTree/index.stories.js"
const emptyObj = {}

function App() {
  const api = useAPI()
  const toast = useToast()
  const [inEditMode, changeEditMode] = useState(false)
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
      visibility={dbTree ? (dbTree.public ? "public" : "private") : "..."}
      onChangeTitle={() => null}
      onChangeId={() => null}
      onChangeVisibility={() => null}
      title={dbTree ? dbTree.tree_name : "..."}
      id={dbTree ? dbTree.tree_key : "..."}
      treeOwnerName={dbTree ? dbTree.owner_name : "..."}
      onCreateNew={() => null}
      onClickEdit={() => changeEditMode(true)}
      currentUserAccountName={account.account_name}
    >
      {loadingNestedTree ? (
        <LoadingScreen />
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
            inEditMode={inEditMode}
            onChangeFlatTree={() => null}
            onChangeMeter={() => null}
            onUnlockTree={() => null}
            onDeleteTree={() => null}
            nestedTree={nestedTree}
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
