// @flow weak

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useReducer
} from "react"
import useAPI from "../../hooks/use-api.js"
import useToast from "../../hooks/use-toast.js"
import useAccount from "../../hooks/use-account.js"
import useNestedTree from "../../hooks/use-nested-tree.js"
import useMeters from "../../hooks/use-meters.js"
import useTreeState from "../../hooks/use-tree-state"
import TreePageContainer from "../TreePageContainer"
import NoTree from "../NoTree"
import NestedWorkTree from "../NestedWorkTree"
import LoadingScreen from "../LoadingScreen"
import getNestedTreeMutators from "../../methods/get-nested-tree-mutators"
import getNestedTreeWithNestedState from "../../methods/get-nested-tree-with-nested-state"
import throttle from "lodash/throttle"
const emptyObj = {}

const onLogOut = () => {
  window.localStorage.clear()
  window.location.reload()
}

export default ({ route, onChangeRoute }) => {
  const api = useAPI()
  const toast = useToast()

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

  const [inEditMode, toggleEditMode] = useReducer(inEditMode => {
    if (!dbTree) return false
    if (!inEditMode && dbTree.owner_id !== api.accountId) {
      toast.error(
        "This tree doesn't belong to you, you have to clone it before you can edit it!"
      )
      return false
    }
    return !inEditMode
  }, false)

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

  const { meters, onChangeMeter } = useMeters(
    dbTree ? dbTree.owner_meter_defs : null
  )

  const onChangeId = useCallback(
    async key => {
      const newTree = await changeDBTree({ tree_key: key })
      const newRoute = "/" + newTree.tree_path
      onChangeRoute(newRoute)
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
    onChangeRoute(`/${newTreePath}`)
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
    onChangeRoute("/" + response.data[0].tree_path)
    if (!inEditMode) toggleEditMode()
  }, [api.accountId])

  const nestedTreeWithNestedState = useMemo(
    () => getNestedTreeWithNestedState(nestedTree, treeState),
    [nestedTree, treeState]
  )

  const onClickHome = useCallback(() => onChangeRoute("/"), [])

  return (
    <TreePageContainer
      visibility={dbTree ? (dbTree.public ? "public" : "private") : "..."}
      onChangeTitle={onChangeTitle}
      onChangeId={onChangeId}
      onClone={onClone}
      onChangeVisibility={onChangeVisibility}
      title={dbTree && dbTree.tree_name}
      id={dbTree && dbTree.tree_key}
      treeOwnerName={dbTree && dbTree.owner_name}
      onLogOut={onLogOut}
      onCreateNew={onCreateNew}
      onClickToggleEdit={toggleEditMode}
      onClickHome={onClickHome}
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
    </TreePageContainer>
  )
}
