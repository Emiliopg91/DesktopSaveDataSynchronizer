import { AppsContext } from '@renderer/contexts/AppsContext';
import { useApp } from '@renderer/hooks/useApp';
import { TranslatorRenderer } from '@tser-framework/renderer';
import { useContext, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FaSyncAlt } from 'react-icons/fa';
import { FaRegTrashAlt, FaStop } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa6';
import { IoAddCircleOutline } from 'react-icons/io5';

import '../styles/components/Games.css';

export function Games({ type }: { type: string }): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [apps, setType, setFilter] = useApp();
  const ctx = useContext(AppsContext);
  useEffect(() => {
    setType(type);
  }, [type]);

  const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(event.target.value);
  };

  const onClickStop = (name: string): void => {
    if (confirm(TranslatorRenderer.translate('sure.to.stop'))) {
      window.api.killApp(name);
    }
  };

  const onClickLaunch = (name: string): void => {
    window.api.launch(name);
  };

  const onClickSync = (name: string): void => {
    window.api.sync(name);
  };

  const onClickDelete = (name: string): void => {
    if (confirm(TranslatorRenderer.translate('sure.to.remove'))) {
      window.api.deleteEntry(name);
      location.reload();
    }
  };

  const onClickNewEntry = (): void => {
    ctx.setShowAddModal(true);
  };

  return (
    <div id="GameComponent">
      <Form.Control
        type="text"
        placeholder={TranslatorRenderer.translate('filter.entries')}
        onChange={onChangeFilter}
        id="filter"
      />
      <Container>
        {apps.map((g, idx) => {
          return (
            <Row className="gameEntryRow" key={idx}>
              <Col className="gameEntryRowInfo" sm={8}>
                <img className="card-img-top" src={'local://' + g.icon?.replaceAll('\\', '/')} />
                <b>{g.name}</b>
              </Col>
              <Col className="gameEntryRowControl" sm={4}>
                {g['running'] && (
                  <button
                    type="button"
                    className="btn"
                    title={TranslatorRenderer.translate('kill.now')}
                    onClick={() => {
                      onClickStop(g.name);
                    }}
                  >
                    <FaStop color="red" />
                  </button>
                )}
                {!g['running'] && (
                  <>
                    <button
                      type="button"
                      className="btn"
                      title={TranslatorRenderer.translate('launch.now')}
                      onClick={() => {
                        onClickLaunch(g.name);
                      }}
                    >
                      <FaPlay color="green" />
                    </button>
                    {ctx.connected && (
                      <button
                        type="button"
                        className="btn"
                        title={TranslatorRenderer.translate('sync.now')}
                        onClick={() => {
                          onClickSync(g.name);
                        }}
                      >
                        <FaSyncAlt color="blue" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn"
                      title={TranslatorRenderer.translate('remove.entry')}
                      onClick={() => {
                        onClickDelete(g.name);
                      }}
                    >
                      <FaRegTrashAlt color="red" />
                    </button>
                  </>
                )}
              </Col>
            </Row>
          );
        })}
        <Row>
          <Col sm={12} id="addNewEntryRow">
            <span onClick={onClickNewEntry}>
              <IoAddCircleOutline /> {TranslatorRenderer.translate('add.new.entry')}
            </span>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
