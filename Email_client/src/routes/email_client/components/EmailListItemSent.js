/**
 * Email List Item
 */
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';

// helpers functions
import { textTruncate } from 'Helpers/helpers';
import { color } from '@material-ui/core/colors';

const EmailListItemSent = ({ email, emailTo, myusername, emailFrom, onSelectEmail, handleMarkAsStar, onReadEmail, getTaskLabelNames }) => (
    <li className="d-flex justify-content-between align-items-center list-item emailListItemadd" onClick={onReadEmail}>
        <div className="d-flex align-items-center w-100 width-80">
            <div className="checkbox-wrap">
                <Checkbox

                    onClick={onSelectEmail}
                />
            </div>
            {/* <div className="icon-wrap">
                <IconButton onClick={handleMarkAsStar} className="mx-10 d-none d-sm-block">
                    <i className={classnames('zmdi zmdi-star', { 'text-warning': email.starred })}></i>
                </IconButton>
            </div> */}
            <div className="emails media w-100">
                {/* <div className="avatar-wrap w-10 align-self-center">
                    {email.from.avatar !== '' ?
                        <img src={email.from.avatar} alt="mail user" className="rounded-circle mr-15 align-self-center" width="40" height="40" />
                        : <Avatar className="mr-15 align-self-center">{email.from.name.charAt(0)}</Avatar>
                    }
                </div> */}
                <div className="media-body d-flex align-items-center w-90">
                    <div className="d-inline-block w-25 w-20">
                        <h5 className="mb-1 mt10">To: {emailTo.map((element,key) => (
                            <span key={key}> {element.first_name === myusername ? 'Me' + ',' : element.first_name + ','} </span>
                        ))}
                        </h5>
                        <span className="font-xs d-inline-block webnoneDisplay">{textTruncate(email.subject, 30)}</span>
                    </div>
                    {email.mail_type === 'very_important' && <div className="mobilenoneDisplay">
                        <span class="importantSignCls">!</span>
                        <span class="importantSignCls">!</span>
                        <span class="importantSignCls">!</span>
                        <i class="fa fa-envelope-o pl10" ></i>
                    </div>}
                    {email.mail_type === 'important' && <div className="mobilenoneDisplay">
                        <span class="importantSignCls">&nbsp;&nbsp;!</span>
                        <i class="fa fa-envelope-o pl10" ></i>
                    </div>}
                    {email.mail_type === 'normal' && <div className="mobilenoneDisplay">
                        <span class="importantSignCls">&nbsp;&nbsp;&nbsp;</span>
                        <i class="fa fa-envelope-o pl10" ></i>
                    </div>}
                    {/*<div className="font-xs text-muted w-75 d-inline-block mb-0 mx-4 content_para mobilenoneDisplay" dangerouslySetInnerHTML={{ __html: textTruncate(email.message, 120) }}></div>*/}
                    <p className="text-muted w-75 d-inline-block mb-0 mx-4 content_para mobilenoneDisplay" >{textTruncate(email.subject, 120)}</p>
                </div>
            </div>
        </div>
        <div className="font-xs text-muted w-10 text-right width-20" style={{ display: "flex" }}>
            {/*<div className="mobilenoneDisplay">
                <i class="fa fa-file-text-o " style={{ fontSize: 15 }}></i>
                <i class="fa fa-paperclip pl10" style={{ fontSize: 15, color: 'green' }}></i>
            </div>*/}
            <p className="pl10 email_datetime"><span>{email.emails.create_Date}, {email.emails.create_Time}</span></p>
            {/* {email.received_time} */}
        </div>
    </li>
);

export default EmailListItemSent;
