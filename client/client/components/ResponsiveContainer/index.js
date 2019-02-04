import React from 'react'
import IsMobile from '../../components/IsMobile'
import { StickyContainer } from 'react-sticky'

export default ({
    children,
    desktopClassName,
    mobileClassName,
    sticky,
    ...containerProps,
}) => {

  return (
    <IsMobile
        render={(isMobile) => {
          return (
            sticky?
              <StickyContainer className={isMobile?mobileClassName:desktopClassName} {...containerProps}>
                {children}
              </StickyContainer>
            :
              <div className={isMobile?mobileClassName:desktopClassName} {...containerProps}>
                {children}
              </div>
          )
        }}
    />
  )
}
