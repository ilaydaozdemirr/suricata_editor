// src/components/IdeLayout.js

import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import HeaderEditor from './HeaderEditor';
import RuleListPanel from './RuleListPanel';
import OptionLibraryPanel from './OptionLibraryPanel';

const IdeLayout = () => {
    return (
        <div className="ide-container">
            <PanelGroup direction="vertical">
                <Panel defaultSize={55} minSize={30}>
                    <PanelGroup direction="horizontal">
                        <Panel defaultSize={65} minSize={40}>
                           <div className="panel-content">
                             <HeaderEditor />
                           </div>
                        </Panel>
                        <PanelResizeHandle className="resize-handle" />
                        <Panel defaultSize={35} minSize={25} collapsible={true}>
                            <div className="panel-content">
                                <OptionLibraryPanel />
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="resize-handle" />
                <Panel defaultSize={45} minSize={20} collapsible={true}>
                    <div className="panel-content">
                        <RuleListPanel />
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default IdeLayout;