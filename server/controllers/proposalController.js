// controllers/proposalController.js
import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';


export const getProposalsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // 1. Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 2. Security Check: Ensure the logged-in user is the client who owns the project
    // Mongoose ObjectIDs must be compared using the .equals() method
    if (!project.client.equals(userId)) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to view these proposals' });
    }

    // 3. Find all proposals for this project and populate freelancer details
    const proposals = await Proposal.find({ project: projectId })
      .populate('freelancer', 'name email skills profilePictureUrl');

    res.json(proposals);
  } catch (err) {
    console.error('Get proposals error:', err.message);
    res.status(500).json({ error: 'Server error while fetching proposals' });
  }
};

export const submitProposal = async (req, res) => {
  try {
    const { coverLetter, bidAmount } = req.body;
    const { projectId } = req.params; // Get project ID from URL
    const freelancerId = req.user._id; // Get freelancer ID from auth middleware

    // 1. Check if the user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can submit proposals' });
    }

    // 2. Find the project and check if it's still open
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ error: 'This project is no longer open for proposals' });
    }

    // 3. Check if the freelancer has already submitted a proposal for this project
    const existingProposal = await Proposal.findOne({ project: projectId, freelancer: freelancerId });
    if (existingProposal) {
      return res.status(409).json({ error: 'You have already submitted a proposal for this project' });
    }

    // 4. Create and save the new proposal
    const proposal = new Proposal({
      project: projectId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
    });

    await proposal.save();

    res.status(201).json(proposal);
  } catch (err) {
    console.error('Submit proposal error:', err.message);
    res.status(500).json({ error: 'Server error while submitting proposal' });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body; // Expecting "accepted" or "rejected"
    const clientId = req.user._id;

    // 1. Validate the incoming status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status update' });
    }

    // 2. Find the proposal and its associated project
    const proposal = await Proposal.findById(proposalId).populate('project');
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // 3. Security Check: Ensure the user is the client for this project
    if (!proposal.project.client.equals(clientId)) {
      return res.status(403).json({ error: 'Forbidden: You are not the owner of this project' });
    }

    // 4. Check if the project is still open
    if (proposal.project.status !== 'open') {
        return res.status(400).json({ error: 'This project is already in progress or completed.' });
    }

    // 5. Update the proposal's status
    proposal.status = status;
    await proposal.save();

    // 6. If accepted, update the project and reject other proposals
    if (status === 'accepted') {
      // Update the project's status and assign the freelancer
      await Project.findByIdAndUpdate(proposal.project._id, {
        status: 'in-progress',
        freelancer: proposal.freelancer,
      });

      // Reject all other pending proposals for this project
      await Proposal.updateMany(
        { project: proposal.project._id, _id: { $ne: proposalId } }, // $ne means "not equal to"
        { status: 'rejected' }
      );
    }

    res.json(proposal);
  } catch (err) {
    console.error('Update proposal status error:', err.message);
    res.status(500).json({ error: 'Server error while updating proposal' });
  }
};