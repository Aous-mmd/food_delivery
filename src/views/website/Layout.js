import React, { Suspense } from 'react'
import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom'
import { CFade } from '@coreui/react'
import '../../scss/web.scss'

// routes config
import WebRoutes from '../../web_routes'

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
)

const Layout = () => {
    return (
        <main className="main">
            <Suspense fallback={loading}>
                <Switch>
                    {WebRoutes.map((route, idx) => {
                        return route.component && (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                render={props => (
                                    <CFade>
                                        <route.component {...props} />
                                    </CFade>
                                )} />
                        )
                    })}
                    <Redirect from="/" to="/404" />
                </Switch>
            </Suspense>
        </main>
    )
}

export default React.memo(Layout)
