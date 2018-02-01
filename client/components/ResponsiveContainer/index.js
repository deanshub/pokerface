import React from 'react'
import IsMobile from '../../components/IsMobile'

export default ({
    children,
    desktopClassName,
    mobileClassName,
    ...containerProps,
}) => {

  return (
    <IsMobile
        render={(isMobile) => {
          return (
              <div className={isMobile?mobileClassName:desktopClassName} {...containerProps}>
              {children}
            </div>
          )
        }}
    />
  )
}
