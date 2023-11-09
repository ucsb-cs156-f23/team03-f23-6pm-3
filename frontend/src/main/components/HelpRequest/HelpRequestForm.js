import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    // Stryker disable next-line Regex
    const teamid_regex = /^[sfwm]\d{2}-(1[0-2]|[1-9])(am|pm)-[1-4]$/i;
    // Stryker disable next-line Regex
    const email_regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/

    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="HelpRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", {
                                required: "Requester Email is required.", pattern: email_regex
                            })}
                            />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail && errors.requesterEmail?.type !== 'pattern' && 'Email is required. '}
                            {errors.requesterEmail?.type === 'pattern' && 'Invalid email. Valid email has a username followed by @ followed by a domain, followed by . and an extension of at least length 2'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="teamId">Team Id</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-teamId"
                            id="teamId"
                            type="text"
                            isInvalid={Boolean(errors.teamId)}
                            {...register("teamId", { 
                                required: true, 
                                pattern: teamid_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.teamId && errors.teamId?.type !== 'pattern' && 'Team Id is required. '}
                            {errors.teamId?.type === 'pattern' && 'Invalid Team Id. Team Id must be in the format qYY-nTT-S, e.g. f23-6pm-3'}
                        </Form.Control.Feedback>
                        
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="tableOrBreakoutRoom">Table Or Breakout Room</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-tableOrBreakoutRoom"
                            id="tableOrBreakoutRoom"
                            type="text"
                            isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                            {...register("tableOrBreakoutRoom", { 
                                required: "Table Or BreakoutRoom is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tableOrBreakoutRoom?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestTime">Request Time (iso format)</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requestTime"
                            id="requestTime"
                            type="requestTime-local"
                            isInvalid={Boolean(errors.requestTime)}
                            {...register("requestTime", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requestTime && errors.requestTime?.type !== 'pattern' && 'Request Time is required. '}
                            {errors.requestTime?.type === 'pattern' && 'Wrong format. Request Time must be in ISO format'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", { 
                                required: "Explanation is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="solved">Solved</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-solved"
                            id="solved"
                            type="text"
                            isInvalid={Boolean(errors.solved)}
                            {...register("solved", { 
                                required: true,
                                pattern: /^(true|false)$/
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.solved && 'Solved is required.'}
                            {errors.solved?.type === 'pattern' && 'Solved must be true or false, e.g. true'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="HelpRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="HelpRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default HelpRequestForm;