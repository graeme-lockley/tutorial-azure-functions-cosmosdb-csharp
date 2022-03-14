namespace PortInMemoryRepositoryTest;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

using PortInMemoryRepository;

[TestClass]
public class RepositoryTest
{
    [TestMethod]
    public async Task GivenRepository_WhenTruncate_ItHasNoEntries()
    {
        var repository = new Repository();

        await repository.Truncate();
        var count = await repository.Count();

        Assert.AreEqual(count, 0);
    }
}
