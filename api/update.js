export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, filename = 'index.html', message = 'Update prices' } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'victorboittiaux1996';
  const REPO_NAME = 'discovery-service';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    // Get current file SHA (required for update)
    const getFileRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    let sha = null;
    if (getFileRes.ok) {
      const fileData = await getFileRes.json();
      sha = fileData.sha;
    }

    // Create or update file
    const updateRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(content).toString('base64'),
          sha,
        }),
      }
    );

    if (!updateRes.ok) {
      const error = await updateRes.json();
      return res.status(updateRes.status).json({ error: error.message });
    }

    const result = await updateRes.json();
    return res.status(200).json({
      success: true,
      message: 'File updated successfully',
      commit: result.commit.sha
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
