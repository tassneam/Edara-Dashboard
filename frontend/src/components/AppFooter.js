import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span href="" target="_blank" rel="noopener noreferrer">
          All Copyright &copy; reserved to Management Inventory System
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
