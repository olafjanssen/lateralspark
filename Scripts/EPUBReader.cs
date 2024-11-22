using Godot;
using System;

public class EPUBReader : Control
{
	private Label _textLabel;
	private int _currentPage = 0;
	private string[] _pages; // Array to hold pages of the EPUB content

	public override void _Ready()
	{
		_textLabel = GetNode<Label>("VBoxContainer/TextLabel");
		LoadEPUB("res://Assets/Piqued.epub"); // Load your EPUB file
		UpdateText();
	}

	private void LoadEPUB(string path)
	{
		// TODO: Implement EPUB parsing logic here
		// For now, let's simulate with dummy data
		_pages = new string[] {
			"Page 1 content...",
			"Page 2 content...",
			"Page 3 content..."
		};
	}

	private void UpdateText()
	{
		if (_pages != null && _currentPage < _pages.Length)
		{
			_textLabel.Text = _pages[_currentPage];
		}
	}

	public void OnNextPageButtonPressed()
	{
		if (_currentPage < _pages.Length - 1)
		{
			_currentPage++;
			UpdateText();
		}
	}

	public void OnPreviousPageButtonPressed()
	{
		if (_currentPage > 0)
		{
			_currentPage--;
			UpdateText();
		}
	}

	// TODO: Implement font size adjustment and customization menu logic
}
