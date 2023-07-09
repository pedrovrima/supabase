import React, { useState, useEffect, useCallback } from 'react'
import type { PostgresColumn, PostgresTable } from '@supabase/postgres-meta'
import { useQueryClient } from '@tanstack/react-query'
import { isUndefined } from 'lodash'
import { observer } from 'mobx-react-lite'

import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

import { ColumnList, TableList } from 'components/interfaces/Database'
import { SidePanelEditor } from 'components/interfaces/TableGridEditor'
import { DatabaseLayout } from 'components/layouts'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import ConfirmationModal from 'components/ui/ConfirmationModal'
import { sqlKeys } from 'data/sql/keys'
import { useStore } from 'hooks'
import { NextPageWithLayout } from 'types'
import { Modal } from 'ui'

const initBgColor = '#000'

const connectionLineStyle = { stroke: '#fff' }
const snapGrid = [20, 20]

const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

const DatabaseTables: NextPageWithLayout = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [bgColor, setBgColor] = useState(initBgColor)

  useEffect(() => {
    const onChange = (event) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2') {
            return node
          }

          const color = event.target.value

          setBgColor(color)

          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          }
        })
      )
    }

    setNodes([
      {
        id: '1',
        type: 'input',
        data: { label: 'An input node' },
        position: { x: 0, y: 50 },
        sourcePosition: 'right',
      },
      {
        id: '2',
        type: 'default',
        data: { label: 'An input node' },
        style: { border: '1px solid #777', padding: 10 },
        position: { x: 300, y: 50 },
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'Output A' },
        position: { x: 650, y: 25 },
        targetPosition: 'left',
      },
      {
        id: '4',
        type: 'output',
        data: { label: 'Output B' },
        position: { x: 650, y: 100 },
        targetPosition: 'left',
      },
    ])

    setEdges([
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: '#fff' },
      },
      {
        id: 'e2a-3',
        source: '2',
        target: '3',
        sourceHandle: 'a',
        animated: true,
        style: { stroke: '#fff' },
      },
      {
        id: 'e2b-4',
        source: '2',
        target: '4',
        sourceHandle: 'b',
        animated: true,
        style: { stroke: '#fff' },
      },
    ])
  }, [])

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)),
    []
  )
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      snapGrid={snapGrid}
      defaultViewport={defaultViewport}
      fitView
      attributionPosition="bottom-left"
      className="bg-body"
    >
      <Controls />
    </ReactFlow>
  )
}

DatabaseTables.getLayout = (page) => <DatabaseLayout title="Database">{page}</DatabaseLayout>

export default observer(DatabaseTables)
