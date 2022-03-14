namespace PortInMemoryRepositoryTest;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

using PortInMemoryRepository;

[TestClass]
public class RepositoryTest : AbstractRepositoryTest
{
    public override async Task<Repository> newRepository() =>
        await Task.Run(() => new Repository());
}

public abstract class AbstractRepositoryTest
{
    abstract public Task<Repository> newRepository();

    [TestMethod]
    public async Task GivenRepository_WhenTruncate_ItHasNoEntries()
    {
        var repository = await newRepository();

        await repository.Truncate();
        var count = await repository.Count();

        Assert.AreEqual(count, 0);
    }
}
