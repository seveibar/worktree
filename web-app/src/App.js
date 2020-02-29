import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useReducer
} from "react"
import useAPI, { APIProvider } from "./hooks/use-api.js"
import useToast from "./hooks/use-toast.js"
import useAccount, { AccountProvider } from "./hooks/use-account.js"
import useNestedTree from "./hooks/use-nested-tree.js"
import useMeters from "./hooks/use-meters.js"
import useTreeState from "./hooks/use-tree-state"
import Page from "./components/Page"
import NoTree from "./components/NoTree"
import NestedWorkTree from "./components/NestedWorkTree"
import LoadingScreen from "./components/LoadingScreen"
import getNestedTreeMutators from "./methods/get-nested-tree-mutators"
import getNestedTreeWithNestedState from "./methods/get-nested-tree-with-nested-state"
import { exampleTree } from "./components/NestedWorkTree/index.stories.js"
import throttle from "lodash/throttle"
const emptyObj = {}

function App() {
  const api = useAPI()
  const toast = useToast()
  const [inEditMode, toggleEditMode] = useReducer(
    inEditMode => !inEditMode,
    false
  )
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
  const [treeState, changeTreeState] = useTreeState(route)
  const {
    dbTree,
    nestedTree,
    changeNestedTree,
    loadingNestedTree,
    treeDoesNotExist,
    changeDBTree
  } = useNestedTree(route, treeState)

  const nestedTreeMutators = useMemo(
    () =>
      getNestedTreeMutators(
        nestedTree,
        changeNestedTree,
        treeState,
        changeTreeState
      ),
    [nestedTree, changeNestedTree, treeState, changeTreeState]
  )

  const onChangeTitle = useCallback(
    title => changeDBTree({ tree_name: title }),
    [changeDBTree]
  )

  const { meters, onChangeMeter } = useMeters()

  const onChangeId = useCallback(
    async key => {
      const newTree = await changeDBTree({ tree_key: key })
      const newRoute = "/" + newTree.tree_path
      changeRouteState(newRoute)
      window.history.replaceState({}, newTree.tree_name, newRoute)
    },
    [dbTree, changeDBTree]
  )
  const onChangeVisibility = useCallback(
    newVisibility => {
      changeDBTree({ public: newVisibility === "public" })
    },
    [changeDBTree]
  )

  const onClone = useCallback(async () => {
    const response = await api.post(
      "tree",
      {
        tree_def: dbTree.tree_def,
        tree_name: dbTree.tree_name,
        tree_key: dbTree.tree_key,
        owner_id: api.accountId
      },
      { headers: { Prefer: "return=representation" } }
    )
    const newTreePath = response.data[0].tree_path
    changeRouteState(`/${newTreePath}`)
  }, [dbTree, account])
  const onUnlockTree = useCallback(
    treeName => {
      changeTreeState({
        ...treeState,
        [treeName]: { ...treeState[treeName], complete: true }
      })
    },
    [treeState]
  )
  const onCreateNew = useCallback(async () => {
    const response = await api.post(
      "tree",
      { owner_id: api.accountId },
      { headers: { Prefer: "return=representation" } }
    )
    changeRoute("/" + response.data[0].tree_path)
    if (!inEditMode) toggleEditMode()
  }, [api.accountId])

  const nestedTreeWithNestedState = useMemo(
    () => getNestedTreeWithNestedState(nestedTree, treeState),
    [nestedTree, treeState]
  )

  return (
    <Page
      visibility={dbTree ? (dbTree.public ? "public" : "private") : "..."}
      onChangeTitle={onChangeTitle}
      onChangeId={onChangeId}
      onClone={onClone}
      onChangeVisibility={onChangeVisibility}
      title={dbTree && dbTree.tree_name}
      id={dbTree && dbTree.tree_key}
      treeOwnerName={dbTree && dbTree.owner_name}
      onCreateNew={onCreateNew}
      onClickToggleEdit={toggleEditMode}
      inEditMode={inEditMode}
      currentUserAccountName={account.account_name}
    >
      {loadingNestedTree ? (
        <LoadingScreen />
      ) : treeDoesNotExist ? (
        <NoTree onCreateTree={onCreateNew} />
      ) : (
        <div style={{ paddingTop: 20 }}>
          <NestedWorkTree
            inEditMode={inEditMode}
            nestedTree={nestedTreeWithNestedState}
            onChangeMeter={onChangeMeter}
            onUnlockTree={onUnlockTree}
            meters={meters}
            {...nestedTreeMutators}
          />
        </div>
      )}
    </Page>
  )
}

export default () => (
  <APIProvider>
    <AccountProvider>
      <App />
    </AccountProvider>
  </APIProvider>
)
