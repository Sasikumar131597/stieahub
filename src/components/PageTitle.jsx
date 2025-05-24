import React from 'react';
import './header_sidebar_components/styles/pagetitle.css'

function PageTitle({page}) {
  return (
    <div className='pagetitle mt-12'>
        <h1>{page}</h1>
        {/*<nav>*/}
        {/*    <ol className='breadcrumb'>*/}
        {/*        <li className='breadcrumb-item'>*/}
        {/*            <a href='/'>*/}
        {/*                <i className='bi bi-house-door'></i>*/}
        {/*            </a>*/}
        {/*        </li>*/}
        {/*        <li className='breadcrumb-item active'>{page}</li>*/}
        {/*    </ol>*/}
        {/*</nav>*/}
    </div>
  )
}

export default PageTitle